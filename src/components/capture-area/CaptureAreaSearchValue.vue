<template>
  <v-card color="background" class="mx-auto" prepend-icon="mdi-magnify">
    <template v-slot:title class="d-flex pa-2">
      Find Value <v-spacer />
      <v-btn
        color="green"
        prepend-icon="mdi-plus"
        size="x-small"
        rounded="lg"
        variant="tonal"
        >Enable</v-btn
      ></template
    >

    <v-card-text>
      <v-row>
        <v-col
          ><v-text-field
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clearable
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
      </v-row>

      <v-row>
        <v-col>is</v-col>
        <v-col
          ><v-combobox
            clearable
            label="Position"
            :items="['After', 'Before', 'Between']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col
          ><v-text-field
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clearable
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
        <v-col
          ><v-btn
            color="red"
            icon="mdi-delete"
            rounded="lg"
            variant="tonal"
          ></v-btn
        ></v-col>
      </v-row>

      <!-- TODO: this can be repeated many times -->
      <v-row>
        <v-col
          ><v-combobox
            clearable
            label="Logical Operator"
            :items="['AND', 'OR', 'NOT']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col
          ><v-combobox
            clearable
            label="Position"
            :items="['After', 'Before', 'Between']"
            variant="underlined"
          ></v-combobox
        ></v-col>
        <v-col
          ><v-text-field
            label="Regular Expression"
            placeholder="Enter a regular expression"
            variant="outlined"
            dense
            clearable
            clear-icon="mdi-close-circle"
            :rules="[(v) => !!v || 'Regular expression is required']"
          ></v-text-field
        ></v-col>
        <v-col
          ><v-btn
            color="red"
            icon="mdi-delete"
            rounded="lg"
            variant="tonal"
          ></v-btn
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
      <!-- TODO: proper layouting is missing -->
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
      <!-- TODO: add more constraints button missing -->
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts"></script>

<style lang="scss"></style>
