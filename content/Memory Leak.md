#MAUI_Hybrid 

If you have a complex UI that has a lot of nested `@if`, you can't call `StateHasChanged()` (or `InvokeAsync(StateHasChanged)`) very frequently since that will cause a memory leak like the image below (it was recorded for 10 minutes from the prayer times app before fixing the memory leak):

![[Pasted image 20250930082503.png]]

But you would say: "What if I have a complex UI and I need an element in it to update frequently?". The solution is quite simple, use **Javascript** to update that UI element instead of C#. Why does that work? Since JS can directly modify the DOM (yes the DOM, since we're using a `BlazorWebView` that is basically a mini browser) while C#'s `StateHasChanged()` is a lot more expensive (it re‑builds a new render tree and diffs it against the previous one).
For the prayer times app, when I modified the frequently changing UI using JS instead of C#, the performance became (the image below was recorded for 1.25 hr):

![[Pasted image 20251003095338.png]]

