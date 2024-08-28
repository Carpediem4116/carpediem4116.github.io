var posts=["2024/08/22/Calulus/","2024/07/19/Elementary number theory/","2024/08/03/hello-world/","2024/05/11/Quantum Physics/","2024/08/12/funcrion/","2024/08/12/inequality/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };