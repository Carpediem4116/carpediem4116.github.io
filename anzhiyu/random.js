var posts=["2024/08/03/hello-world/","2024/08/11/函数/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };