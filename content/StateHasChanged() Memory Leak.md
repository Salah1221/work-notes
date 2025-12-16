---
tags:
  - MAUI_Hybrid
  - bug
  - memory_leak
author: Salah Najem
authorUrl: https://github.com/Salah1221
---
In .NET 9, if you have a complex UI that has a lot of nested `@if`, you can't call `StateHasChanged()` (or `InvokeAsync(StateHasChanged)`) very frequently since that will cause a memory leak like the image below (it was recorded for 10 minutes from the prayer times app before fixing the memory leak):

![[Pasted image 20250930082503.png]]

But you would say: "What if I have a complex UI and I need an element in it to update frequently?". The solution is quite simple, use **Javascript** to update that UI element instead of C#. Why does that work? Since JS can directly modify the DOM (yes the DOM, since we're using a `BlazorWebView` that is basically a mini browser) while C#'s `StateHasChanged()` is a lot more expensive (it re‑builds a new render tree and diffs it against the previous one).
For the prayer times app, when I modified the frequently changing UI using JS instead of C#, the performance became (the image below was recorded for 1.25 hr):

![[Pasted image 20251003095338.png]]

Also, to prevent Blazor from rerendering elements controlled by JS, you can create a new razor component:

```razor
@*
    Component that prevents Blazor re-renders for elements controlled by JavaScript.
    This improves performance by allowing JavaScript to directly manipulate the DOM
    without triggering Blazor's rendering cycle.

    Use the Version parameter to trigger re-renders when underlying data changes:
    - Clock/countdown elements controlled by JS: Don't set Version (always skip renders)
    - Prayer times/static content: Set Version to a value that changes when data updates
*@

@ChildContent

@code {
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Optional version key. When this changes, the component will re-render once.
    /// Use this for elements that contain Blazor-bound data that changes infrequently
    /// (e.g., prayer times that change daily, iqama times that change with settings).
    /// Leave null for purely JS-controlled elements (clocks, countdowns).
    /// </summary>
    [Parameter]
    public object? Version { get; set; }

    private object? _lastVersion;
    private bool _shouldRenderOnce;

    protected override bool ShouldRender()
    {
        // If Version parameter is not set, never re-render (pure JS control)
        if (Version == null)
        {
            return false;
        }

        // Check if version has changed
        if (!Equals(_lastVersion, Version))
        {
            _lastVersion = Version;
            _shouldRenderOnce = true;
            return true;
        }

        // If we just rendered due to version change, prevent next render
        if (_shouldRenderOnce)
        {
            _shouldRenderOnce = false;
            return false;
        }

        // Default: don't re-render
        return false;
    }
}
```

And wrap any element controlled by JS with that component like that:

```razor
@* ... *@
<JsControlled>
    <div class="time-with-ampm">
        <MudText
            Style="color: white; font-weight: bold; font-size: clamp(9rem, 5.4783rem + 5.2174vmax, 18rem)"
            Typo="Typo.h1"
            Align="MudBlazor.Align.Center"
            data-clock-time>@Format12Hour(_timeNow ?? DateTime.Now)</MudText>
        <MudText Style="color: white; font-size: clamp(7rem, 4.2609rem + 4.058vmax, 14rem)" Typo="Typo.h4"
                 Class="ampm-indicator-normal clock"
                 data-clock-ampm>@Format12Hour(_timeNow ?? DateTime.Now, true)</MudText>
    </div>
</JsControlled>
@* ... *@
```

If you want Blazor to rerender the element when some variable changes, you can add the `Version` field to the `JsControlled` component:

```razor
 <JsControlled Version="@($"{_settings?.Id}_{_settings?.Messages?.Count}")">
     <MudText Typo="Typo.h4"
              Style="color: white; opacity: 0.9; line-height: 1.7; text-align: center; margin-bottom: 0.625rem"
              data-message-text>
     </MudText>
     <MudText Typo="Typo.h5" Style="color: white; opacity: 0.7; text-align: center"
              data-message-source>
     </MudText>
 </JsControlled>
```

In this example, Blazor only renders these `MudText` components if the settings change or the number of message change.