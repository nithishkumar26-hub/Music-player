<script>
// @ts-nocheck
    // import { focusEnabled } from '../store';
    import { createEventDispatcher, onMount } from 'svelte';
    export let songdetail;
    export let items;
    export let playallsongs;
    console.log("playallsongs",playallsongs)
    let playpause=false;
    let song=null;
    let totaltracktime;
    let currenttimedisplay='--:--';
    let totaltimedisplay='--:--';   
    let progress=0;
    let volprogress=100;
    let volhighlow=false;
    let isMuted=false;
    let shuffleOk=false;
    let repeatOk=false;
    export let songindex=0;
    let tracktimer;
    const dispatch = createEventDispatcher();


    $:if(songdetail){
    
          
            initializeTrack()
        
        
    }

    function initializeTrack(){
        song=new Audio(songdetail);
        console.log("song",song);
        song.onloadedmetadata = () =>{
                totaltracktime=song.duration;
                console.log("file duration",song.duration)
                updateTrack()
                updateTime()
                song.play()
                playpause=true
                playallsongs=true
                song.onended= () =>{
                    if(shuffleOk){
                        nextButton();
                        playpause=false;
                        playallsongs=false;
                    }
                    if(repeatOk){
                        loadMusic(songindex);
                    }
                   
                }
        }
        
    }

    function nextButton(){
        song.pause()
        songindex++;
        loadMusic(songindex)
    }

    function prevButton(){
        song.pause()
        songindex--;
        loadMusic(songindex)
    }

    function playShuffle(){ 
        shuffleOk=!shuffleOk;
    }

    function playRepeat(){
        repeatOk=!repeatOk;
    }
       
    $:{
        if(playallsongs ){
        
            playMusic()
        }
        else{
            pauseMusic()
        }
        
    }
    
       

    function loadMusic(indexNumb) {
        if (items ){
            song=new Audio(items[indexNumb].downloadUrl[4].url);
            console.log("song",song);
            song.onloadedmetadata = () =>{
                totaltracktime=song.duration;
                console.log("file duration",song.duration)
                updateTrack()
                updateTime()
                if(playallsongs){
                    song.play()
                    playpause=true
                }
                else{
                    song.pause()
                    playpause=false
                }
                if(songdetail){
                    song.pause()
                }
                
                
            }
            dispatch("indexnumb",indexNumb)
            song.onended= () =>{
                if(shuffleOk){
                    nextButton();
                }
                if(repeatOk){
                    loadMusic(songindex);
                }
                playpause=false;
                playallsongs=false;
            }
        }
        
    }

    function pauseMusic() {
        if (song){
            song.pause();
            playpause=false;
            updateTrack();
        }
    }

    function playMusic() {
        if (!song){
           loadMusic(songindex);
        }
        else{
            updateTrack();
            song.play();
            playpause=true;
            
        }
    }

    function playPause(){
        
        if(song && song.paused){
            updateTrack()
            song.play()
            playpause=true
            playallsongs=true
        }
        
        else if (song){
            updateTrack()
            song.pause()
            playpause=false
            playallsongs=false

        }
        // focusEnabled.set(true);
    }

    function updateTime(){

       if(song){
            progress = (song.currentTime / totaltracktime) * 100;
            //start timer
            // let curhrs=Math.floor((song.currentTime / 60)/60);
            let curmin=Math.floor(song.currentTime/ 60);
            let cursec=Math.floor(song.currentTime - curmin * 60)


            //end timer
            let durhrs=Math.floor((totaltracktime / 60) / 60);
            let durmin=Math.floor((totaltracktime / 60)%60);
            let dursec=Math.floor(totaltracktime - (durhrs * 60*60) - (durmin * 60))

            if(cursec < 10) cursec = `0${cursec}`;
            if(dursec < 10) dursec = `0${dursec}`;
            if(curmin < 10) curmin = `0${curmin}`;
            if(durmin < 10) durmin = `0${durmin}`;


            currenttimedisplay=`${curmin}:${cursec}`
            totaltimedisplay=`${durmin}:${dursec}`
        }
        

       
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
        if(song){
            const newProgress = event.target.value;
            progress=newProgress
            const newTime =(progress / 100) * totaltracktime;  
            song.currentTime =  newTime; 
            updateTime();
        }
            
        
    }

    function updateVolume(event){
        if(song){
            const newVolume = event.target.value;
            if(newVolume > 50){
                volhighlow = true;
            }
            else if(0< newVolume < 50){
                volhighlow = false;
            }
            volprogress=newVolume
            song.volume=newVolume/100;
        }
            
        
    }

    function audioMute(){
            isMuted=!isMuted
            song.muted=isMuted;
    }

</script>

<div class="w-[100%]  flex justify-center mx-auto flex-col">
   
    <div class="flex flex-row  p-4 justify-center items-center h-[80px] w-full">
        <button class="m-4" on:click={()=>playShuffle()}>
            {#if shuffleOk}
                <i class="fa-solid fa-shuffle"  style="color: #f53193;"></i>
            {:else}
                <i class="fa-solid fa-shuffle"  style="color: #ffffff;"></i>
            {/if}
        </button>
        <button class="w-8 h-8 rounded-full bg-white shadow-xl m-4" on:click={()=>prevButton()}>
            <i class="fa-solid fa-backward text-violet-700 fa-sm"></i>
        </button>
        <button class="w-[50px] h-[50px] rounded-full bg-violet-700 shadow-xl m-4" on:click={()=>playPause()}>
            {#if playpause}
                <i class="fa-solid fa-pause fa-xl text-white fa-xl"></i>
            {:else}
                <i class="fa-solid fa-play fa-xl text-white fa-xl"></i>
            {/if}
        </button>
        <button class="w-8 h-8 rounded-full bg-white shadow-xl m-4" on:click={()=>nextButton()}>
            <i class="fa-solid fa-forward text-violet-700 fa-sm"></i>
        </button>
        <button class="m-4" on:click={()=>playRepeat()}>
            {#if repeatOk}
                <i class="fa-solid fa-repeat " style="color: #f53193;"></i>
            {:else}
                <i class="fa-solid fa-repeat " style="color: #ffffff;"></i>
            {/if}
        </button>
    </div>
    <div class="flex flex-row justify-center ml-[180px] ">
        <div class=" flex flex-row items-center justify-around w-[60%] ">
            <div class="font-raleway text-sm text-[#fff] font-semibold ">{currenttimedisplay}</div>
            <input type="range" id="progress" class="w-[80%]  bg-violet-700 rounded cursor-pointer appearance-none
            h-2  " bind:value={progress} on:input={updateProgress}/>
            <div class="font-raleway text-sm text-[#fff] font-semibold ">{totaltimedisplay}</div>
        </div>
        <div class=" flex justify-end ml-[30px] items-center">
            <button on:click={()=>audioMute()}>
                {#if isMuted}
                    <i class="fa-solid fa-volume-xmark" style="color: #ec3ca3;" ></i>
                {:else}
                    {#if volhighlow}
                        <i class="fa-solid fa-volume-high" style="color: #805ad5;"></i>
                    {:else if !volhighlow}
                        <i class="fa-solid fa-volume-low" style="color:#805ad5;"></i>
                    {/if}
                {/if}
            </button>
            <input type="range" id="volprogress" class="w-[70%] bg-violet-600 appearance-none rounded cursor-pointer h-2 ml-[10px]"
            bind:value={volprogress} on:input={updateVolume}/>
        </div>
    </div>
   
    <!-- <button on:click={()=>loadMusic(songi  ndex)}>play</button> -->
   
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

    #volprogress::-webkit-slider-thumb{
        appearance: none;
        width: 26px;
        height: 26PX;
        border-radius: 50%;
        border: 8px solid #fff;
        box-shadow: 0 5px 5px rgba(255, 26, 26, 0.22);
    }

    
</style>