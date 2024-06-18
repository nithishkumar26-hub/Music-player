<script>
    // @ts-nocheck
    
        import Playlist from "../../../lib/c-playlist.svelte"
        import { onMount } from "svelte";
        import { page } from "$app/stores";
        let albumid;
    
        onMount(()=>{
            albumid=$page.params.id;
            console.log("albumid: " + albumid);
        })
    </script>
    
    {#if albumid}
    <Playlist {albumid}/>
    {/if}