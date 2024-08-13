var posts=["2024/08/03/hello-world/","2024/08/12/inequality/","2024/08/12/funcrion/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };