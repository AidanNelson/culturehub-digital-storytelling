var socket = io();


let prompt="Sorry, our opperator couldn't reach you over the phone. Please help verify your identity."
let socket_text="Which of the following most resembles the house of your dreams?"
let back_col=[102,127,255]
let images=[]
let img_selection=[];
let submit;

let h;
let w;

function preload() {
  for (let i=0;i<9;i++){
    images[i]=loadImage('./houses/house'+i+".jpg")
  }
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(220);
  h=height*0.7;
  w=h*0.7;
  for (i=0;i<9;i++){
    img_selection[i]=false;
  }
  submit = createButton('verify');
  submit.position((width-w)/2+w-60, (height-h)/2+h-30);
  submit.mousePressed(submitted);
  textSize(14);
  skin();

}

function draw() {
}

function skin(){
  noStroke();
  fill(255);

  // rectMode(CENTER);
  rect((width-w)/2,(height-h)/2,w,h)
  fill(color(back_col));
  rect((width-w)/2+4,(height-h)/2+4,w-8,h*0.2)
  textWrap(WORD);
  fill(255)
  text(prompt+"\n"+socket_text,(width-w)/2+8,(height-h)/2+10,w-12)
  loadImages(h,w);

}

function loadImages(h,w){
  let margin=4;
  w=w-margin*5;//offset margins
  let x_img=w/3;
  let y_img=w/3;
  let x_start=(width-w)/2-margin;
  let y_start=(height-h)/2+margin*2+h*0.2;
  fill(0)
  for (let j=0;j<3;j++){
    for (let i=0;i<3;i++){
      image(images[j+i*3],x_start+(x_img+margin)*i,y_start+(y_img+margin)*j,x_img,y_img)
      if(img_selection[i+j*3]){
        stroke(20,255,0);
        strokeWeight(5)
        noFill();
        rect(x_start+(x_img+margin)*i,y_start+(y_img+margin)*j,x_img,y_img)
      }
    }
  }
}

function mousePressed(){
  skin();

  let h=height*0.7;
  let w=h*0.7;

  let margin=4;
  w=w-margin*5;//offset margins
  let x_img=w/3;
  let y_img=w/3;
  let x_start=(width-w)/2-margin;
  let y_start=(height-h)/2+margin*2+h*0.2;


  for (let j=0;j<3;j++){
    for (let i=0;i<3;i++){
      let x_lim_min=x_start+(x_img+margin)*i;
      let x_lim_max=x_lim_min+x_img;

      let y_lim_min=y_start+(y_img+margin)*j;
      let y_lim_max=y_lim_min+y_img

      if(mouseX>x_lim_min && mouseX<x_lim_max){
        if(mouseY>y_lim_min && mouseY<y_lim_max){
          noFill();
          stroke(0,220,200);
          // background(0);
          img_selection[i+j*3]=true;
          rect(x_start+(x_img+margin)*i,y_start+(y_img+margin)*j,x_img,y_img)

        }else{
          img_selection[i+j*3]=false;
        }
      }else{
        img_selection[i+j*3]=false;
      }
    }
  }

}

//once the button is clicked
function submitted(){
  //check if an image was selected;
  for(let i=0;i<9;i++){
    if(img_selection[i]){
      console.log("selected")
      let msg={'promt':socket_text,'captcha_select':i}
      socket.emit("data",msg)
    }
  }
}

socket.on("data", function (data) {
  //mainly for troubleshootings
  // console.log("We got the message "+ data);
  console.log(data)
});

socket.on("server_prompt", function (data) {
  //the server needs to send a prompt and an array of 9 images url
  socket_text=data.prompt;

  for (let i=0;i<9;i++){
    // images[i]=loadImage('./houses/house'+i+".jpg")
    images[i]=loadImage(data.img_src[i]);
  }
  skin();//skin just redraws the captcha with the prompt and images

});
