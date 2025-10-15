---
tags:
  - MAUI_Hybrid
---
If you for some reason removed the `autostart` attribute from the `<script>` tag initializing the Blazor Webview, the app would simply won't load.
## What is `autostart`?

`autostart` is **not a native HTML attribute**; it’s a **Blazor‑specific flag** that the **`blazor.*.js`** boot script reads. Browsers ignore it; Blazor doesn’t.

### What it does in MAUI Blazor (BlazorWebView)

- By default, `blazor.webview.js` will **auto‑boot** the Blazor runtime as soon as it loads.
    
- In a WebView, there’s a short window where the **native bridge** (WebView <-> .NET) might not be ready yet. If auto‑boot happens too early, startup can fail or hang.
    
- Setting `autostart="false"` tells the Blazor script **“don’t boot yourself”**.  
    Then the **BlazorWebView control** (on the native side) calls `Blazor.start()` at the correct time, once the bridge is ready—hence your app started working.
    

### When to use it

- It is used in **MAUI Blazor** (or any host that will call `Blazor.start()` itself):

    ```html
    <script src="_framework/blazor.webview.js" autostart="false"></script>
    ```
    
    Here we disabled auto-starting `blazor.webview.js` by setting `autostart` to `false`, since MAUI will start it manually. Usually when you create a new MAUI Blazor (MAUI Hybrid) project, the `autostart` is set to `false` by default in the template.

All in all, if you unintentionally removed the `autostart="false"` from a MAUI Hybrid project, the application will be stuck on the loading screen most of the time.
