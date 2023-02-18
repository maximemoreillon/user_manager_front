export default {
  methods: {
    format_date(d) {
      if (!d) return "No date"

      // Check if Neo4J format
      if (d.year) return `${d.year}/${d.month}/${d.day}`

      return new Date(d).toString()
    },
  },
}
