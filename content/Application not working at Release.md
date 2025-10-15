#MAUI_Hybrid 
Imagine that you have tested your application in Debug mode and everything was working very well, then you publish your application and open it and... it doesn't behave like it did in Debug mode 😢. That bug could happen for several reasons, but for my case (in the prayer times app), the reason was that the AOT compilation, linker, and trimmer was removing important JavaScript code used by C# that it thought is unused. I simply disabled all of them by adding the following code in the `.csproj` file:

```xml
<PropertyGroup Condition="'$(Configuration)|$(TargetFramework)'=='Release|net9.0-android'">  
    <!-- Disable AOT compilation and linker to prevent JavaScript stripping -->  
    <RunAOTCompilation>false</RunAOTCompilation>  
    <AndroidLinkMode>None</AndroidLinkMode>  
    <PublishTrimmed>false</PublishTrimmed>  
</PropertyGroup>
```

>[!attention]
>Don't disable those optimizations if they aren't causing any issues for your application

In my case, I was working with .NET 9 on android and thus the `TargetFramework` is `Release|net9.0-android` (the `Release` keyword is to indicate that those changes I want only in release). And that solved the issue!
