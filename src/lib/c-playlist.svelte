<script>
// @ts-nocheck
    import Table from "../lib/c-songtable.svelte"
    import Newplayer from "../lib/c-newplayer.svelte"
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher();
    import { onMount } from "svelte";
    import axios from "axios";
    export let id;
    export let albumid;
    let songdetail;
    let playallsongs=false;
    let songValues={}
    let clickrowid;
    let songindex;
    let items=[];
   
    let columns =[
        {label:"#",key:"id"},
        {label:"Title",key:"name"},
        {label:"Album",key:"album"},
        {label:"Duration",key:"duration"},
    ]
    

    onMount(() => {
        if(id){
            getsongData()
        }
        if(albumid){
            getAlbumdata()
        }
    });

    function getsongData(){
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://saavn.dev/api/playlists?id=${id}&limit=40`,
        headers: { }
        };

        axios.request(config)
        .then((response) => {
            songValues = response.data.data;
            console.log("songdata:", songValues); 
            const getdata=secondstominutes(songValues.songs);
            console.log("getdata:", getdata);
            items=getdata;
        // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
    }

    function getAlbumdata(){
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://saavn.dev/api/albums?id=${albumid}&limit=10`,
        headers: { }
        };

        axios.request(config)
        .then((response) => {
            songValues = response.data.data;
            console.log("songdata:", songValues); 
            const getdata=secondstominutes(songValues.songs);
            console.log("getdata:", getdata);
            items=getdata;
        // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
    }

    function secondstominutes(duration){
        return duration.map(entry =>{
            return {
                ...entry,
                duration: convertseconds(entry.duration)
            }
        });
    }

    function convertseconds(seconds){
        let minutes = Math.floor(seconds / 60);
        let remseconds = seconds % 60
        const songvalue=`${minutes}:${remseconds}`;
        return songvalue;
    }
    // window.addEventListener('eventName', handleMyEvent);
    function handleMyEvent(event){
        console.log(event.detail);  
        songdetail=event.detail;    
    }

    function handleThisEvent(event){
        console.log(event.detail);  
        clickrowid=event.detail;
    }

    function handleMyIndex(event){
        console.log(event.detail);  
        songindex=event.detail;
    }
    function toggleClick(){
        playallsongs= !playallsongs; 
        dispatch('togglePlayAll', { playallsongs });
    }

</script>

<div class=" rounded-lg w-[80%] h-[100vh] mx-auto overflow-y-hidden" id="playlist">
        <div class="flex flex-col overflow-y-auto h-[80vh]">
            <div class="flex flex-col h-[47vh]">
                <div class="flex flex-row h-[30vh]">
                    {#if Array.isArray(songValues.image)}
                        {#each songValues.image as image, index}
                            {#if index === 2}
                                <div class="flex justify-start pt-[30px] px-[50px]">
                                    <img src="{image.url}" alt="image" class="w-[180px] h-[180px] rounded-3xl"/>
                                </div>
                            {/if}
                        {/each}
                    {/if}
                    <div class="flex flex-col pt-[40px] text-left">
                        <div class="font-roboto text-base font-bold text-pretty text-[#fff]  ">playlist</div>
                        <div class="font-roboto text-6xl font-bold text-pretty text-[#fff] pt-[8px] ">{songValues.name}</div>
                        <div class="font-roboto text-2xl font-bold text-pretty text-[#fff] pt-[8px]  ">{songValues.description}</div>
                    </div>
                </div>
                <div class="flex justify-start px-[50px] pt-[30px]">
                    <button class="w-[60px] h-[60px] rounded-full bg-violet-600 shadow-3xl z-10 " on:click={()=>toggleClick()}>
                        {#if playallsongs}
                            <i class="fa-solid fa-pause fa-xl text-white"></i>
                        {:else}
                            <i class="fa-solid fa-play fa-xl text-white"></i>
                        {/if}
                        
                    </button>
                </div>
            </div>
        
            <Table {items} {columns} on:eventName={handleMyEvent} on:eventIndex={handleMyIndex} {clickrowid} {playallsongs}/>

            
            
        </div>
        <div class="w-[100%] h-[25vh] bg-purple-950 shadow-lg rounded-xl mx-auto">
            <Newplayer {songdetail} {items} {songindex} bind:playallsongs on:indexnumb={handleThisEvent}/>
        </div>
</div>

<style>
    #playlist{
        background-image: url('/bgframe1.png');
        width: 80%;
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        max-height: 100%;
        overflow: hidden;
    }
</style>


<!-- textcolor: [#f53193]; -->
