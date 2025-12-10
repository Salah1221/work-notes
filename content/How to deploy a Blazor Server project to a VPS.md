---
tags:
  - blazor
  - blazor_server
  - tips
  - deployment
author: Salah Najem
authorUrl: https://github.com/Salah1221
---
In this blog post, we'll learn how to deploy a Blazor Server application to a custom VPS. I'll be referencing [[How to deploy a Blazor WASM project to a VPS|this blog post]] since there are some common steps.
## Publishing the application

Go to your Blazor Server application and publish it:

```bash
dotnet publish BlazorApp.csproj -c Release -o ./publish
```

And then send it to the VPS (be sure to create the `/var/www/myBlazorApp` folder beforehand in the VPS):

```bash
scp -r ./publish/* root@109.176.198.125:/var/www/myBlazorApp/
```

## Setting up the VPS

### Installing .NET on the server

First of all, you have to install .NET on the VPS. For ubuntu, you have to install the dotnet install script using:

```bash
curl https://builds.dotnet.microsoft.com/dotnet/scripts/v1/dotnet-install.sh >> dotnet-install.sh
```

Then make it executable:

```bash
chmod +x dotnet-install.sh
```

After that run it:

```bash
./dotnet-install.sh --install-dir /usr/share/dotnet
```

And finally create a symlink to the `dotnet` in the `/usr/bin` (so you could use `dotnet` without modifying the `.bashrc`):

```bash
sudo ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet
```

Now you can go to the project's root directory (in my case it is `/var/www/myBlazorApp`) and run the application:

```bash
dotnet BlazorApp2.dll
```

### NGINX Configuration

Open another tab, ssh to your VPS and write the following nginx config (in `/etc/nginx/sites-available/`):

```nginx
server {
    listen 8888;
    server_name _;  # accept any host / IP

    # Optional: if you want NGINX to serve static files from your publish directory
    root /var/www/PrayerTimesServer/wwwroot;

    gzip on;
    gzip_types text/plain application/json text/css application/javascript;
    gzip_min_length 1024;

    # First try to serve static files, then fall back to Kestrel
    location / {
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_pass         http://localhost:5000;  # your Blazor Server port
        proxy_http_version 1.1;

        # WebSockets / SignalR (Blazor Server requires this)
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;

        # Forward original client details (optional but recommended)
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;

        # Avoid Blazor disconnects on long-lived connections
        proxy_read_timeout    3600s;
        proxy_send_timeout    3600s;
        proxy_connect_timeout 3600s;
        proxy_buffering       off;
    }
}
```

Then create a symlink to that config to enable it:

```bash
sudo ln -s /etc/nginx/sites-available/myBlazorApp /etc/nginx/sites-enabled/myBlazorApp
```

After that, reload nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Then go to `http://SERVER_IP:8888`, the webpage should open:

![[Pasted image 20251209145148.png]]

### Creating a service to run the application

But now the problem is that if you close the first tab (where you ran `dotnet BlazorApp2.dll`), the webpage is gone:

![[Pasted image 20251209145606.png]]

Thus, we need a service that runs the Blazor application at startup in the background. Since we're on ubuntu, we can use a systemd service to do that. 

Create the following `/etc/systemd/system/myBlazorApp.service`:

```ini
[Unit]
Description=Blazor Server Demo App
After=network.target

[Service]
WorkingDirectory=/var/www/PrayerTimesServer
ExecStart=/usr/bin/dotnet /var/www/myBlazorApp/BlazorApp2.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
```

Then reload systemd and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable myBlazorApp.service
sudo systemctl start myBlazorApp.service
```

The website is deployed successfully and will auto-start if the VPS rebooted for some reason.