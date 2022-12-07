<template>
    <!-- Position and more about the area -->
    <v-card
        rounded="lg"
        prepend-icon="mdi-information"
        color="background"
        class="mb-4"
    >
        <template v-slot:title> Capture area Properties </template>

        <v-divider color="primary" class="mb-4"></v-divider>

        <v-card-text>
            <v-row class="mb-4" no-gutters>
                <v-col>Size</v-col>
            </v-row>
            <v-row class="mb-4" no-gutters>
                <v-col class="pr-2"
                    ><v-text-field
                        label="Width"
                        variant="outlined"
                        :rules="[(v) => !!v || 'A width is required']"
                    ></v-text-field
                ></v-col>
                <v-col
                    ><v-text-field
                        label="Height"
                        variant="outlined"
                        :rules="[(v) => !!v || 'A height is required']"
                    ></v-text-field
                ></v-col>
            </v-row>

            <v-row class="mb-4" no-gutters><v-col> Position </v-col></v-row>
            <v-row class="mb-4" no-gutters>
                <v-col class="pr-2"
                    ><v-text-field
                        label="Top"
                        variant="outlined"
                        :rules="[(v) => !!v || 'X-coordinate is required']"
                    ></v-text-field
                ></v-col>
                <v-col
                    ><v-text-field
                        label="Left"
                        variant="outlined"
                        :rules="[(v) => !!v || 'Y-coordinate is required']"
                    ></v-text-field
                ></v-col>
            </v-row>

            <v-row class="mb-4" no-gutters align="center">
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
                        >Add Find value</v-btn
                    >
                </v-col>
                <v-col>
                    <v-divider color="grey" />
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn
                        color="green"
                        prepend-icon="mdi-content-save"
                        rounded="lg"
                        variant="tonal"
                        >Save</v-btn
                    >
                </v-col>
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
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
