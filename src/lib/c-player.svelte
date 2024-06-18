<script>
// @ts-nocheck
   
    
   import { onMount } from "svelte"
   import axios from "axios";

   export let idno;
   console.log(idno);

    // let songData;
    let playpause=false;
    let song;
    
    //display the song timer and track
    let totaltracktime;
    let totaltimedisplay;
    let currenttimedisplay;
    let tracktimer;

    let durhrs;
    let durmin;
    let dursec;
    let progress= 10
    //get the song detail
    let songdetail=[];
    let songdata;
    let songimage;

    

    $:if(idno){
        getsongData()
    }
        
 

    function playPause(){
        
        if(song && song.paused){
            updateTrack()
            song.play()
            playpause=true
        }
        
        else if (song){
            updateTrack()
            song.pause()
            playpause=false
        }
       
    }

    
    // function mySong(){
        
    //     totaltracktime=song.duration;
    //     console.log("file duration",song.duration)
    //     updateTime()
    // }

    function updateTime(){

       
        progress = (song.currentTime / totaltracktime) * 100;
    

        //start timer
        // let curhrs=Math.floor((song.currentTime / 60)/60);
        let curmin=Math.floor(song.currentTime/ 60);
        let cursec=Math.floor(song.currentTime - curmin * 60)

          
        //end timer
        durhrs=Math.floor((totaltracktime / 60) / 60);
        durmin=Math.floor((totaltracktime / 60)%60);
        dursec=Math.floor(totaltracktime - (durhrs * 60*60) - (durmin * 60))

        if(cursec < 10) cursec = `0${cursec}`;
        if(dursec < 10) dursec = `0${dursec}`;
        if(curmin < 10) curmin = `0${curmin}`;
        if(durmin < 10) durmin = `0${durmin}`;
      

        currenttimedisplay=`${curmin}:${cursec}`
        totaltimedisplay=`${durmin}:${dursec}`

        playpause = song.ended ? false : !song.paused;
    }
 
    function updateTrack(){
        if(song.ended){
            clearInterval(tracktimer)
        }
        else{
            tracktimer= setInterval(updateTime,100)
        }
    }
    
    

    function updateProgress(event){
        const newProgress = event.target.value;
        progress=newProgress
        const newTime =(progress / 100) * totaltracktime;  
        song.currentTime =  newTime; 
        updateTime();
    }

    const  getsongData = () => {
      
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://saavn.dev/api/songs?ids=${idno}`,
        headers: { }
        };

        axios.request(config)
        .then((response) => {
            songdetail=response.data.data[0];
            songdata=songdetail.downloadUrl[4].url;
            songimage=songdetail.image[2].url;
            console.log("songdetail",songdetail);
            console.log("songdata",songdata);
            
            if(songdetail){
                song=new Audio(songdata);
                console.log("song",song);
                song.onloadedmetadata = () =>{
                    totaltracktime=song.duration;
                    console.log("file duration",song.duration)
                    updateTrack()
                    updateTime()
                    song.play()
                    playpause=true
                   
                }
               
            }
            // song = document.getElementById("myAudio");  
            // console.log(song);
            // song.addEventListener('loadedmetadata', mySong);
        // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });

    }
   

</script>

    
   
    <div class="w-[30%] mx-auto h-[600px] my-[60px] bg-pink-100 rounded-lg font-serif   " id="container">
       
        <div class="w-full">
            <div class="p-8 flex flex-row w-full justify-between">
                <button class="w-9 h-9 rounded-full bg-white shadow-xl">
                    <i class="fa-solid fa-chevron-left text-[#ff80d5]"></i>
                </button>
                <button class="w-9 h-9 rounded-full bg-white shadow-xl">
                    <i class="fa-solid fa-bars text-[#ff80d5]"></i>
                </button>
            </div>
            
                <div class="mt-[-30px] flex justify-center">    
                    <img src={songimage} alt="music" class="w-[220px] h-[220px]"/>
                </div>
                <div class="w-full flex  justify-center flex-col mt-1">
                    <h1 class="font-raleway text-white flex justify-center font-bold text-2xl">{songdetail.name}</h1>
                    <span class="font-raleway text-sm text-white flex justify-center mt-2">
                        {#if songdetail?.artists?.primary}
                            {songdetail.artists.primary.map(item => item.name).join(', ')}
                        {/if}
                    </span>
                        
                    
                </div>
                <div class="w-full flex justify-center">
                    <audio  src={songdata} id="myAudio" >
                        
                    </audio>
                        
                   
                </div>
                <div class="w-full flex flex-col justify-center">
                    <input type="range" id="progress" class="w-[80%] appearance-none bg-[#f53192] rounded cursor-pointer h-2 mx-auto mt-[40px]" bind:value={progress}
                    on:input={updateProgress}/>
                    <div class="flex flex-row justify-between w-[80%] mx-auto mt-[8px]">
                        <div class="font-roboto text-sm text-[#fff] font-semibold">{currenttimedisplay}</div>
                        <div class="font-roboto text-sm text-[#fff] font-semibold">{totaltimedisplay}</div>
                    </div>
                </div>
                <div class="flex flex-row w-[80%] p-4 justify-evenly mx-auto items-center">
                    <button class="w-12 h-12 rounded-full bg-white shadow-xl">
                        <i class="fa-solid fa-backward text-[#f53192]"></i>
                    </button>
                    <button class="w-[70px] h-[70px] rounded-full bg-[#f53192] shadow-xl" on:click={()=>playPause()}>
                        {#if playpause}
                            <i class="fa-solid fa-pause fa-xl text-white"></i>
                        
                        {:else}
                            <i class="fa-solid fa-play fa-xl text-white"></i>
                        {/if}
                    </button>
                    <button class="w-12 h-12 rounded-full bg-white shadow-xl ">
                        <i class="fa-solid fa-forward text-[#f53192]"></i>
                    </button>
                </div>
            
        </div>
    </div>


<style>
    #progress::-webkit-slider-thumb{
        appearance: none;
        width: 26px;
        height: 26PX;
        border-radius: 50%;
        border: 8px solid #fff;
        box-shadow: 0 5px 5px rgba(255, 26, 26, 0.22);
    }

    #container{
        background-image: url('/bgframe3.png');
        width: 30%;
        height: 600px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        max-height: 100%;
        overflow: hidden;
    }
    
</style>

