import { ref } from "vue";
export default function useAddSong() {
  let addSongRef = ref();
  function showAddSong() {
    addSongRef.value.show();
  }
  return {
    addSongRef,

    showAddSong,
  };
}
