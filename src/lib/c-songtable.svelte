<script>
// @ts-nocheck
    // import Newplayer from "../lib/c-newplayer.svelte"
    import { focusEnabled } from '../store';
    import { onMount } from 'svelte';   

    let focusActive = false;
    export let clickrowid;
    export let columns;
    export let items;
    export let indexvalue;
    console.log("indexvalue: " , indexvalue)
    export let playallsongs;
    let songdetail="";
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    function getdata(id,id1){
        clickrowid= id1;
        songdetail=id;
        console.log("songdetail",songdetail)
        dispatch('eventName',songdetail);
        dispatch('eventIndex',clickrowid);
    }

    onMount(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
        document.body.removeEventListener('click', handleClickOutside);
        };
    });

    function handleClickOutside(event) {
        const target = event.target;
        const isTableComponent = target.closest('.Tablerow');
        if (!isTableComponent) {
        focusActive = true;
            // setTimeout(() => {
            //     focusActive = false;
            // }, 100);
        }
    }

    
  
</script>
<body>
<div class="flex flex-col">

    <div class="w-[95%] h-[30vh] rounded-3xl  mx-auto  overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 
    scrollbar-thumb-rounded-full scrollbar-track-rounded-full text-white">
        <table class="w-full">
            <thead class="sticky">
                <tr class="flex flex-row w-full justify-between sticky">
                
                        {#each columns as header}
                            {#if header.key === "id"}
                                <th class="flex pl-[65px] w-[25%]">{header.label}</th>
                            {:else if header.key === "name"}
                                <th class="flex justify-start w-1/4">{header.label}</th>
                            {:else}
                                <div class="flex justify-center w-1/2 pl-[70px]">
                                    <th >{header.label}</th>    
                                </div>
                            {/if}
                        {/each}
                
                </tr>
            </thead>
            <tbody> 
                {#each items as item, index }
                    <tr class="flex flex-row font-sans text-base w-full p-[10px] hover:bg-[#ffe6f3] active:bg-blue-400 Tablerow focus:outline-none focus-bg-blue-400 rounded-[20px]" 
                    id="tr" tabindex="0" style="background-color: {  (focusActive && clickrowid === index) ? 'rgba(0,0,0,0.4)'  : 'transparent'  }" on:click={()=>getdata((item.downloadUrl[4].url),(index))}>
                        {#each columns as column}
                            
                                {#if column.key === "id"}   
                                    <div class="flex justify-center w-[20%]">
                                       
                                        {#if clickrowid === index && playallsongs}
                                            <img src="/audiowave.gif" alt="audiowave" class="w-[30px] h-[30px]"/>
                                        {:else}
                                            <td class="w-[20%]">{index + 1}</td>
                                        {/if}
                                    </div>
                                {:else if column.key === "name"}
                                    <div class="    w-[75%] flex flex-row justify-start">
                                        {#each item.image as image, index}
                                            {#if index === 2}
                                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                                <img src="{image.url}" alt="image"  class="w-[60px] h-[60px] rounded-full"/>
                                            {/if}
                                        {/each}
                                        <div class="flex flex-col pl-[10px]">
                                            <div class="font-bold">{item.name}</div>
                                            <div class="flex flex-row pt-[4px]">
                                                <!-- {#each item.artists.primary as artist}
                                                    <div>{artist.name},</div>
                                                {/each} -->
                                                {item.artists.primary.map(item => item.name).join(",")}	
                                            </div>
                                        </div>
                                    </div>
                                {:else if column.key === "album"}
                                    <div class="w-1/2 px-[50px]">{item.album.name}</div>
                                {:else if column.key === "duration"}
                                    <div class="w-1/2 flex justify-center">{item.duration}</div>
                                {/if}
                        
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    
</div>
</body> 

<style>
    body{
        background-color: rgba(0,0,0,0.2);
        border-radius: 20px;
    }
    
</style>

    

