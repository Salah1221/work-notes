---
tags:
  - blazor
  - blazor_web_assembly
  - tips
author: Salah Najem
authorUrl: https://github.com/Salah1221
---
In this blog post, we'll learn how to deploy a Blazor WebAssembly Standalone application to a VPS. We'll start first by setting up the VPS for that.
## Setting up the VPS

Login to the your VPS and create the web root directory (choose a proper name, here we'll use `myWasmApp`):
```bash
sudo mkdir -p /var/www/myWasmApp
```

And you need to have nginx installed:

```bash
sudo apt install nginx
```

Then, you'll create the nginx config for your WASM app:

```bash
sudo nano /etc/nginx/sites-available/myWasmApp
```

And add the following in the `myWasmApp` config file:

```nginx
server {
    listen 8080;
    server_name _;

    root /var/www/myWasmApp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Here we're listening to port `8080` without specifying a domain name (in the `server_name` section). We used `root` to specify the working directory and the `index` keyword to point to the `index.html`. As for the `location /`, it does the following:

- 

>[!warning] Note
>In a real application t