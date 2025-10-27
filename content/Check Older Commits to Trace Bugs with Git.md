---
author: Salah Najem
authorUrl: https://github.com/Salah1221
tags:
  - git
  - debugging
  - tips
---
You've just finished coding a new feature and ran the application and then... a bug appeared. Is it because of the newly added feature or was it there before? If you're using git, knowing that is very easy using the **detached HEAD mode**.

Normally when you're working on a branch, the HEAD pointer points towards the branch name as shown in the git tree below (the circles are commits):

![[normal_head.excalidraw.png]]

Assume that commits 4 and 5 were related to the newly added feature. I want to go back to commit 3 to test the application there. That is done using the following command:

```bash
git checkout <commit_hash>
```

Where `<commit_id>` is the hash of the commit that you want to go back to. Assume that the hash of commit 3 is `9156020b650840bf1eca078665f912ab33764be3`, then the command would be:

```bash
git checkout 9156020b650840bf1eca078665f912ab33764be3
```

>[!note]
>You don't need to write the entire hash. The first seven characters are usually enough. You can rewrite the command as:
>```bash
>git checkout 9156020
>```

And now the git tree will look like:

![[detached_head.excalidraw.png]]

And now you can test the application to see if the bug was caused by the new changes made or was there before. When you're done testing and want to return to your main branch, simply run:

```bash
git switch main
```

