var socket = io();

let img_selections=[1,2,4,8];
// let img_selections={"img":1,"img":2,"img2":4,"img3":8};
let images=[];
let current_img=0;
let tansition;
function preload(){
  loadImages();
}

function loadImages(){
 for(let i=0;i<4;i++){

  images[i]=loadImage('../images/'+i+'/'+img_selections[i]+".jpg")
  // images[i]=loadImage('https://livelab.morakana.com/images/'+i+'/'+img_selections[i]+".jpg")
 }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  showImg();
}

function showImg(){
  tint(255, 50)
  image(images[current_img],0,0,width,height);
  setTimeout(showImg,100);
}

function keyPressed() {

  if (keyCode === LEFT_ARROW) {
    current_img -=1;
    if(current_img<0){
      current_img==0;
    }
  } else if (keyCode === RIGHT_ARROW) {
      current_img +=1;
      if(current_img>3){
        current_img==3;
      }
  }
  // showImg();
}

function draw() {
}

socket.on("background_img", function (data) {
  //expects an array of 4 values, each value represnts the image index to show
  img_selections=data;
  loadImages();
});

// function transition(){
//   let now=millis();
//   while (now+3000>millis()){
//     let c=images[current_img].get(floor(random(images[current_img].w)),floor(random(images[current_img].w)));
//     fill(c);
//     noStroke();
//     ellipse(random(width),random(height),20,20);
//
// }
//   setTimeout(showImg, 4000);
// }
