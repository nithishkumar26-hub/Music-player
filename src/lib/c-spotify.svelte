<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import axios from "axios";
   
    
    let getCategories = [];
    let getAlbums = []; 
    let getSongs=[];
    let getlist = []
    let getlist1=[]
    let combinedarray = []
 
    
    let getAudio=false;
    let value="";
    let BASE_URL="https://saavn.dev/api/search";

    function handleClick(){
        if(value){
            getAudio=!getAudio;
            getMusic()
        }
       
    }

    onMount(()=>{
        getPlaylist();
    })

    onMount(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
        document.body.removeEventListener('click', handleClickOutside);
        };
    });

    function handleClickOutside(event) {
        const target = event.target;
        const issongs = target.closest('.songrow');
        if (!issongs) {
            getAudio=!getAudio;
            // setTimeout(() => {
            //     focusActive = false;
            // }, 100);
        }
    }

    
    const getPlaylist = () =>{
        
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://saavn.dev/api/search/playlists?query=tamil romance&page=1&limit=3',
        headers: { }
        };

        let config1={
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://saavn.dev/api/search/playlists?query=tamil kuthu&page=1&limit=3',
            headers: { }
        }   

        Promise.all([
            axios.request(config),
            axios.request(config1)
        ])

        .then(([response1,response2]) => {
            getlist = response1.data.data.results;
            getlist1= response2.data.data.results;
            combinedarray = [...getlist, ...getlist1]   
            console.log("combinedarray",combinedarray)
        })

        .catch((error) =>{
            console.log("Api error",error)
        })
    }

    function getMusic() {
        
        let config = {
        method: 'get',  
        maxBodyLength: Infinity,
        url: `${BASE_URL}?query=${value}?page=0&limit=10`,
        headers: { }
        };

        axios.request(config)
        .then((response) => {
            getCategories=response.data.data.topQuery.results;
            getAlbums=response.data.data.albums.results
            getSongs=response.data.data.songs.results;
            // audio=getCategories.downloadUrl[4]
            // getImage=getCategories.image
            // getArtist=getCategories.artists.all
            // console.log("audio",audio);
            console.log("getCategories",getCategories);
            console.log("getAlbums",getAlbums);
            console.log("getSongs",getSongs);
        // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
    }

    

    function handleInput(event){
        value=event.target.value;
        console.log(value)
    }

    function changePage(id){
        // callComponent=true;
        goto(`/player/${id}`)
        
       
    }

    function newPlaylist(id){
        goto(`/playlist/${id}`)
    }

    function newAlbum(id){
        goto(`/album/${id}`)
    }


</script>



<div class="  rounded-lg w-[90%] mx-auto h-[100vh]" id="spotify">
    <div class="flex flex-row flex justify-center items-center pt-[40px]">
        <img src="/letter-p.png" alt="image" class="w-[40px] h-[40px]"/>
        <span class="font-roboto text-3xl text-[#ff80d5]">Pink player</span>
    </div>
    <div class=" w-full mx-auto pt-[20px] flex justify-center ">
        <input class="w-[80%] h-[40px] bg-[#fff] rounded-full mx-[10px] mt-[15px] pl-[12px] font-roboto tracking-wide border-[2px]
        border-[#ff80d5] focus:outline-[#f53193] text-base text-[#343757]"  placeholder="Play what you love" on:input={handleInput}/>
        <button class="w-[40px] h-[40px] rounded-full bg-white mt-[15px]  {value !=="" ?'cursor-pointer':'cursor-not-allowed' }  " on:click={()=>handleClick()}>
            <i class="fa-solid fa-magnifying-glass fa-lg" style="color: #fb79d2;"></i>
        </button>
    </div>
    {#if getAudio && value}
        <div class="w-[80%] h-[60%]  bg-[rgba(0,0,0,0.2)] text-white rounded-xl flex justify-start mx-[120px] songrow ">
            <div class="flex flex-col w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-full" id="progress">
                {#each getCategories as categories, index}
                    
                        <button class="flex flex-row w-full p-[15px] hover:bg-[rgba(0,0,0,0.4)] rounded-lg cursor-pointer" >
                            {#each categories.image as item, index}
                                {#if index === 2}                   
                                    <img src="{item.url}" alt="image" class="w-[60px] h-[60px] rounded-full"/>
                                {/if}              
                            {/each} 
                            <div class="flex flex-col  overflow-hidden ml-[30px]">
                                <div class="font-roboto text-base  font-medium text-left">{categories.title}</div>
                                <div class="w-full whitespace-nowrap overflow-hidden mt-1 ">
                                    {#if categories.type ==="song"}
                                        <button class="flex flex-row animate-marquee font-roboto text-base font-normal" on:click={()=>changePage(categories.id)}>
                                            {categories.language}.
                                            {categories.type}.
                                            {categories.description}.
                                            <!-- {categories.artists.primary.map(item => item.name).join(', ')}. -->
                                            {categories.primaryArtists}.
                                            {categories.album}
                                        </button>
                                    {:else if categories.type === "album"}
                                        <button class="flex flex-row animate-marquee font-roboto text-base font-normal" on:click={()=>newAlbum(categories.id)}>
                                            {categories.language}.
                                            {categories.type}.
                                            {categories.description}.
                                            <!-- {categories.artists.primary.map(item => item.name).join(', ')}. -->
                                
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        </button>
                   
                {/each}
                {#each getSongs as songs, index}
                    
                        <button class="flex flex-row w-full p-[15px]    hover:bg-[rgba(0,0,0,0.4)] rounded-lg cursor-pointer" on:click={()=>changePage(songs.id)}>
                            {#each songs.image as item, index}
                                {#if index === 2}                   
                                    <img src="{item.url}" alt="image" class="w-[60px] h-[60px] rounded-full"/>
                                {/if}              
                            {/each} 
                            <div class="flex flex-col  overflow-hidden ml-[30px]">
                                <div class="font-roboto text-base  font-medium text-left">{songs.title}</div>
                                <div class="w-full whitespace-nowrap overflow-hidden mt-1 ">
                                    <div class="flex flex-row animate-marquee font-roboto text-base font-normal">
                                            {songs.language}.
                                            {songs.type}.
                                            {songs.description}.
                                            <!-- {categories.artists.primary.map(item => item.name).join(', ')}. -->
                                            {songs.primaryArtists}.
                                            {songs.album}
                                    </div>
                                    
                                </div>
                            </div>
                        </button>
                   
                {/each}
                {#each getAlbums as albums, index}
                    
                        <button class="flex flex-row w-full p-[15px]    hover:bg-[rgba(0,0,0,0.4)] rounded-lg cursor-pointer" on:click={()=>newAlbum(albums.id)}>
                            {#each albums.image as item, index}
                                {#if index === 2}                   
                                    <img src="{item.url}" alt="image" class="w-[60px] h-[60px] rounded-full"/>
                                {/if}              
                            {/each} 
                            <div class="flex flex-col  overflow-hidden ml-[30px]">
                                <div class="font-roboto text-base  font-medium text-left">{albums.title}</div>
                                <div class="w-full whitespace-nowrap overflow-hidden mt-1 ">
                                    <div class="flex flex-row animate-marquee font-roboto text-base font-normal">
                                            {albums.language}.
                                            {albums.type}.
                                            {albums.description}.
                                            <!-- {categories.artists.primary.map(item => item.name).join(', ')}. -->
                                            
                                    </div>
                                    
                                </div>
                            </div>
                        </button>
                   
                {/each}
               
            </div>
        </div>
    {:else }
        <div class="  w-full mx-auto pt-[30px] flex justify-center  flex-col">
            <div class="font-roboto text-pretty w-[80%] mx-auto text-[3.25rem] leading-9 text-[#fff] ">Recommended Playlist</div>
            <div class="h-full w-[80%] mx-auto grid gap-6 grid-cols-6 mt-[40px]">
                {#each combinedarray as list}
                    <button class="w-full " on:click={()=>newPlaylist(list.id)}>
                        {#each list.image as image, index}
                            {#if index === 2}
                                <img src="{image.url}" alt="image"  class="w-[150px] h-[170px] rounded-sm"/>
                            {/if}
                        {/each}
                    </button>
                {/each}
            </div>
           
        </div>
    {/if}
</div>



<style>
@keyframes marquee {
  0% {
    transform: translateX(10%);
  }
  100% {
    transform: translateX(-70%);
  }
}

.animate-marquee {
  animation: marquee 10s linear infinite; /* Adjust duration as needed */
}

#spotify{
    background-image: url("/bgframe.png");
    width: 90%;
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    max-height: 100%;
    overflow: hidden;
}

#progress::-webkit-scrollbar{
    display: none;
    scrollbar-width: none;
}
</style>

