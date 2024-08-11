var posts=["2024/07/31/My-New-Post/","2024/08/03/hello-world/","2024/08/11/逻辑/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };