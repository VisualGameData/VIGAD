<template>
  <!-- Position and more about the area -->
  <v-card prepend-icon="mdi-information" color="background" class="mb-4">
    <template v-slot:title class="d-flex pa-2">
      Capture area Properties
    </template>

    <v-card-text>
      <v-row>
        <v-col>Size</v-col>
        <v-col
          ><v-text-field
            clearable
            label="Width"
            variant="outlined"
          ></v-text-field
        ></v-col>
        <v-col
          ><v-text-field
            clearable
            label="Height"
            variant="outlined"
          ></v-text-field
        ></v-col>
      </v-row>

      <v-row>
        <v-col> Position </v-col>
        <v-col
          ><v-text-field clearable label="X" variant="outlined"></v-text-field
        ></v-col>
        <v-col
          ><v-text-field clearable label="Y" variant="outlined"></v-text-field
        ></v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-divider></v-divider>
        </v-col>
        <v-col>
          <v-btn
            prepend-icon="mdi-plus"
            size="small"
            rounded="lg"
            variant="outlined"
            >Add Find value</v-btn
          >
        </v-col>
        <v-col>
          <v-divider></v-divider>
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
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts"></script>

<style lang="scss"></style>
