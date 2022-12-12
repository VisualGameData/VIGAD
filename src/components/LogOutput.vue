<template>
    <v-alert
        border="start"
        icon="mdi-information"
        :title="title"
        type="success"
        class="log-output-container"
    >
        {{ log }}
    </v-alert>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    captureAreaId: number;
}>();

const title = ref(`Capture Area ${props.captureAreaId} Output`);
const log = ref('');

// vigad.getCaptureArea(id).getRegexGroups()[0].getValueRegex().getLastBestMatch()

// const testd = ref(
//     vigad.value
//         .getCaptureArea(0)
//         .getRegexGroups()[0]
//         .getValueRegex()
//         .getLastBestMatch()
// );

function abc() {
    // console.log(
    //     '->',
    //     vigad.value
    //         .getCaptureArea(0)
    //         .getRegexGroups()[0]
    //         .getValueRegex()
    //         .getLastBestMatch()
    // );
}
</script>

<style lang="scss" scoped>
.log-output-container {
    max-height: 350px;
    overflow-y: auto;
}
</style>
