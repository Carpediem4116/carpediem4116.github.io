var posts=["2024/08/22/Calulus/","2024/07/19/Elementary number theory/","2024/08/03/hello-world/","2024/05/11/Quantum Physics/","2024/08/12/funcrion/","2024/08/12/inequality/","2024/08/30/markdown语法/","2024/05/28/Astironomu and Cosmology/","2024/08/30/latex/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };