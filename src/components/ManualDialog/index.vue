<template>
  <div class="manual-dialog">
    <big-dialog>
      <div slot="title">标题</div>
      <div slot="content">123</div>
    </big-dialog>
  </div>
</template>

<script>
import BigDialog from "@/components/BigDialog";

export default {
  name: "manual-dialog",
  components: {
    BigDialog,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.manual-dialog {
}
</style>
