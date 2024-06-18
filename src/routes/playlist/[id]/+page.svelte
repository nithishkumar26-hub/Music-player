<script>
// @ts-nocheck

    import Playlist from "../../../lib/c-playlist.svelte"
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    let id;

    onMount(()=>{
        id=$page.params.id;
        console.log("id: " + id);
    })
</script>

{#if id}
<Playlist {id}/>
{/if}