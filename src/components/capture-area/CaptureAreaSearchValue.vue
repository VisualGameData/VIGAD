<template>
  <v-card
    rounded="lg"
    color="background"
    class="mb-4"
    prepend-icon="mdi-magnify"
  >
    <template v-slot:title>
      <v-row no-gutter>
        <v-col>Find Value</v-col>
        <v-spacer />
        <v-col>
          <v-btn
            color="green"
            prepend-icon="mdi-plus"
            size="small"
            rounded="lg"
            variant="tonal"
            >Enable</v-btn
          ></v-col
        >
      </v-row>
    </template>

    <v-divider color="primary" class="mb-4"></v-divider>

    <v-card-text>
      <v-row class="mb-4" no-gutter>
        <v-col
          ><v-text-field
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
      </v-row>

      <v-row class="mb-4" no-gutters cols="12">
        <v-col cols="2">is</v-col>
        <v-col cols="3"
          ><v-combobox
            class="pr-2 pl-2"
            label="Position"
            :items="['After', 'Before', 'Between']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col cols="7"
          ><v-text-field
            cols="1"
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
      </v-row>

      <v-row class="mb-4" no-gutters>
        <v-col cols="2"
          ><v-combobox
            label="Logic"
            :items="['AND', 'OR', 'NOT']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col cols="3"
          ><v-combobox
            class="pr-2 pl-2"
            label="Position"
            :items="['After', 'Before', 'Between']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col cols="7"
          ><v-text-field
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
        <!-- <v-col
          ><v-btn
            color="red"
            icon="mdi-delete"
            rounded="lg"
            variant="tonal"
          ></v-btn
        ></v-col> -->
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
            >Add constraints</v-btn
          >
        </v-col>
        <v-col>
          <v-divider color="grey" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <!-- TODO: proper layouting is missing -->
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
