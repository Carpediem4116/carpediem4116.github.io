var posts=["2024/08/03/hello-world/","2024/08/12/Math/funcrion/","2024/07/19/Math/Elementary number theory/","2024/09/23/vscode/","2024/08/12/Math/inequality/","2024/08/30/Markdown/latex/","2024/08/22/Math/Calulus/","2024/08/30/Markdown/markdown语法/","2024/05/28/Physcis/Astironomu and Cosmology/","2024/09/09/Physcis/P4 Summary/","2024/08/31/Computer Science/A2(znotes)/BinaryFile/","2024/09/11/Physcis/P5 Writing/","2024/05/11/Physcis/Quantum Physics/","2024/09/02/Computer Science/AS/Ch2/","2024/08/31/Computer Science/A2(znotes)/Data Representation/","2024/09/27/Computer Science/A2(znotes)/P3 Summary/","2024/09/27/Computer Science/A2(znotes)/P4 Summary/","2024/09/04/Computer Science/AS/Ch3/","2024/09/05/Computer Science/AS/Ch4/","2024/09/26/Computer Science/AS/znotes/Ch8/","2024/09/26/Computer Science/AS/znotes/Ch2/","2024/09/23/Computer Science/AS/znotes/paper1/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };