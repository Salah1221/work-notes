---
tags:
  - blazor
  - blazor_web_assembly
  - tips
  - deployment
author: Salah Najem
authorUrl: https://github.com/Salah1221
---
In this blog post, we'll learn how to deploy a Blazor WebAssembly Standalone application to a VPS. We'll start first by setting up the VPS for that.
## Setting up the VPS

Login to the your VPS and create the web root directory (choose a proper name, here we'll use `myWasmApp`), change the ownership of that directory to the `www-data` user (that is used by nginx) and change its permissions:

```bash
sudo mkdir -p /var/www/myWasmApp
sudo chown -R www-data:www-data /var/www/myWasmApp
sudo chmod -R 755 /var/www/myWasmApp
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

Here we're listening to port `8080` without specifying a domain name (in the `server_name` section). We used `root` to specify the working directory and the `index` keyword to point to the `index.html`. As for the `location /`, it takes the incoming URL path and does the following:

- Checks if the URL path is a real file on disk (`$uri`)
- If not, check if it corresponds to a real directory (`$uri/`)
- If neither exists, return `index.html` instead.

>[!warning] Note
>In a real application, the listening port should be `80` and there should be a domain name (for example `server_name app.example.com;`). Also, you'd configure the SSL certificate for `https` (I'll add how to do that in a later date Insha'Allah)

Then enable the config using a symlink:

```bash
sudo ln -s /etc/nginx/sites-available/myWasmApp /etc/nginx/sites-enabled/myWasmApp
```

After that, enable and reload nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

>[!info] Note
>If you get an error that port `80` is used by other program when restarting (or starting) nginx, that is because the default nginx config is configured to listen at port `80` and is located in `/etc/nginx/sites-available/default` you'll have to change the port there or you can delete the default config entirely if you want to. But in general, you'll always want nginx to listen to port `80`.

To check that everything is working, you can create an `index.html` that contains some text:

```bash
echo "nginx is working" | sudo tee /var/www/myWasmApp/index.html
```

Now, if you go to `http://SERVER_IP:8080`, you should see the following page:

![[Pasted image 20251205111004.png]]

## Publish the application manually to the VPS

In your dev machine, go to the directory of the project (that you want to deploy) and publish the application:

```bash
dotnet publish PrayerTimeTV.csproj -c Release -o ./publish
```

Then, upload the published application to the VPS using `scp`:

```bash
scp -r ./publish/wwwroot/* root@SERVER_IP:/var/www/myWasmApp/ 
```

You will be prompted to accept the fingerprint and to write the root password. Now, the application is deployed successfully:

![[Pasted image 20251205130513.png]]

## Create a Github workflow for deployment

Publishing the application manually at every change is a bit tedious. Thus, we'll create a GitHub workflow to automatically handle that when pushing to `main`. Before that, we want to create an ssh key so that github can access the VPS without requiring a password. Run the following command on your dev machine:

```bash
ssh-keygen -t ed25519 -C "deploy-key"
```

Where `"deploy-key"` can be replaced by anything (email, name, some identifier, etc...). Then go to where the ssh keys where saved and get the public key:

```bash
cat "C:\Users\Salah Najem\.ssh\id_deploy.pub"
ssh-ed25519 AAAAC...4Uht deploy-key
```

Then you go to your VPS dashboard and add that public key:

![[Pasted image 20251205134416.png]]

![[Pasted image 20251205134444.png]]

![[Pasted image 20251205134608.png]]

And you wait till that key is added to the list of ssh keys of the server (if your VPS's dashboard doesn't have that feature, you'll have to add the public key manually... there are a lot of tutorials on that)

As for the private key, you should add that to the GitHub secrets of the repo. To do that, you go to the settings (of the repo):

![[Pasted image 20251205135020.png]]

And there you add the repo secrets:

![[Pasted image 20251205135051.png]]

Get the content of the private key using:

```bash
cat "C:\Users\Salah Najem\.ssh\id_deploy"
-----BEGIN OPENSSH PRIVATE KEY-----
(very long block)
-----END OPENSSH PRIVATE KEY-----
```

Then create a new secret that has the name `SSH_PRIVATE_KEY` and the value of the private key:

![[Pasted image 20251205135344.png]]

Then, add the server's IP and user (which is `root` in our case) to GitHub secrets under the names `SERVER_IP` and `SERVER_USER` respectively:

![[Pasted image 20251205140142.png]]

We can now add the deployment workflow to the repository. Create a `.github` directory, then a `workflows` directory inside it, and place the `deploy.yml` file there. That file contains:

```yml
name: Deploy Blazor WASM to VPS

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "9.0.x"

      - name: Build
        run: dotnet publish PrayerTimeTV/PrayerTimeTV/PrayerTimeTV.csproj -c Release -o ./publish

      - name: Deploy
        uses: burnett01/rsync-deployments@5.2
        with:
          path: ./publish/wwwroot/
          remote_path: /var/www/myWasmApp/
          remote_host: ${{ secrets.SERVER_IP }}
          remote_user: ${{ secrets.SERVER_USER }}
          remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
          switches: -avz --delete
```

Let's explain the workflow line by line:

- **Workflow Name:** that is simply the name of the workflow (that is displayed in GitHub actions)
- **Workflow triggers:**
```yml
on:
  push:
    branches: ["main"]
  workflow_dispatch:
```
This workflow will run when:
1. Code is pushed to the `main` branch
2. Manually triggered from the GitHub Actions UI (`workflow_dispatch`)

- **Job Definition:**
```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
```
This defines a single job name "deploy" that will execute on GitHub's hosted `ubuntu-latest` virtual machine.

- **Steps:** Each step runs in order
	- **Step 1:** 
	```yml
	- uses: actions/checkout@v4
	```
	This pulls your repo's code into Github's virtual machine (to access the project's files).
	- **Step 2:**
	```yml
	- uses: actions/setup-dotnet@v4
    with:
      dotnet-version: "9.0.x"
	```
	This installs the .NET SDK version 9.0.x, so that you can "publish" the app on that virtual machine.
	- **Step 3:**
	```yml
	- name: Build
    run: dotnet publish PrayerTimeTV/PrayerTimeTV/PrayerTimeTV.csproj -c Release -o ./publish
	```
	This simply runs the publish command.
	- **Step 4:**
	```yml
	- name: Deploy
    uses: burnett01/rsync-deployments@5.2
    with:
      path: ./publish/wwwroot/
      remote_path: /var/www/myWasmApp/
      remote_host: ${{ secrets.SERVER_IP }}
      remote_user: ${{ secrets.SERVER_USER }}
      remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
      switches: -avz --delete
	```
	This step connects to the VPS over SSH and uploads the published Blazor WASM files.

Finally, you push this change to the remote repo:
```bash
git push
```

Now the workflow will run automatically in your repo, you can view its progress here in "Actions":

![[Pasted image 20251205144952.png]]

And that's it! Try changing anything in your Blazor WASM app, push your change to `main` and wait for the workflow to run. Your change then will appear on the deployed website.