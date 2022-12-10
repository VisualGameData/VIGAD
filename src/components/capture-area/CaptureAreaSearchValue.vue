<template>
    <v-card rounded="lg" color="background" class="mb-4">
        <template v-slot:title> Find value </template>

        <v-divider color="primary" class="mb-4"></v-divider>

        <v-card-text>
            <v-checkbox label="Enable Search"></v-checkbox>
            <v-row class="mb-4" no-gutter>
                <v-col
                    ><v-text-field
                        label="Regular Expression"
                        placeholder="Enter a regular expression"
                        variant="outlined"
                        clear-icon="mdi-close-circle"
                        :rules="[
                            (v) => !!v || 'Regular expression is required',
                        ]"
                    >
                        <template v-slot:prepend-inner>
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-icon
                                        v-bind="props"
                                        icon="mdi-help-circle-outline"
                                    ></v-icon>
                                </template>

                                I'm a tooltip
                            </v-tooltip>
                        </template>
                        <template v-slot:append-inner>
                            <v-fade-transition leave-absolute>
                                <v-progress-circular
                                    v-if="true"
                                    color="info"
                                    indeterminate
                                    size="24"
                                ></v-progress-circular>
                            </v-fade-transition>
                        </template> </v-text-field
                ></v-col>
            </v-row>

            <v-row class="mb-4" no-gutter>
                <v-combobox
                    label="Slicing Options"
                    :items="['All substrings', 'At spaces', 'Entire string']"
                    variant="underlined"
                ></v-combobox>
            </v-row>

            <v-row class="mb-4" no-gutter>
                <v-combobox
                    label="Matching"
                    :items="[
                        'Approximate (default - constraint regex)',
                        'Exact (default - value regex)',
                    ]"
                    variant="underlined"
                ></v-combobox>
            </v-row>

            <v-row class="mb-4" no-gutter>
                <v-text-field
                    label="Regular Expression"
                    placeholder="Amount of generated matches"
                    variant="outlined"
                    dense
                    clear-icon="mdi-close-circle"
                    :rules="[(v) => !!v || 'Regular expression is required']"
                ></v-text-field>
            </v-row>

            <v-row class="mb-4" no-gutter>
                <v-combobox
                    label="Similarity conversions"
                    :items="[
                        'None',
                        'Numbers to Letters',
                        'Letters to Numbers',
                    ]"
                    variant="underlined"
                ></v-combobox>
            </v-row>

            <!-- <v-row class="mb-4" no-gutters align="center">
                <v-col>
                    <v-divider color="grey" />
                </v-col>
                <v-col>
                    <v-btn
                        color="grey"
                        prepend-icon="mdi-plus"
                        size="small"
                        rounded="lg"
                        variant="outlined"
                        >Add constraints</v-btn
                    >
                </v-col>
                <v-col>
                    <v-divider color="grey" />
                </v-col>
            </v-row> -->
        </v-card-text>
        <v-card-actions>
            <v-row no-gutter>
                <v-col>
                    <v-btn
                        color="green"
                        prepend-icon="mdi-content-save"
                        rounded="lg"
                        variant="tonal"
                        >Save</v-btn
                    >
                </v-col>
                <v-spacer></v-spacer>
                <v-col>
                    <v-btn
                        color="red"
                        prepend-icon="mdi-delete"
                        rounded="lg"
                        variant="tonal"
                        >Delete</v-btn
                    >
                </v-col>
            </v-row>
            <!-- TODO: add more constraints button missing -->
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
