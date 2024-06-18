<script>
    // @ts-nocheck
    
        import Player from "../../../lib/c-player.svelte"
        import { onMount } from "svelte";
        import { page } from "$app/stores";
        let idno;
        
        onMount(()=>{
            idno= $page.params.id;
            console.log("id: " + idno);	
        })
    </script>

    {#if idno}
    
        <Player {idno}/>
    {/if}