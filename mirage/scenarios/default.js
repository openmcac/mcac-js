export default function(server) {
  const englishService =
    server.create("group", {
      about: "Welcome friends and visitors. We invite you to make MCAC your spiritual home and to worship with us every Sunday morning at 9:30am. Please let us know how we can be of help to you.",
      bannerUrl: "https://mcac.s3.amazonaws.com/groups/887d6625-eb28-4de6-a158-d25bf5bf147f.jpg",
      meetDetails: "Sundays at 9:30am",
      name: "English Service",
      profilePictureUrl: "https://mcac.s3.amazonaws.com/groups/5c7d76a8-d195-4907-951d-5b3fb00c438d.jpg",
      shortDescription: "Worship service for the English congregation",
      slug: "english-service",
      targetAudience: "Members and seekers"
    });

  for (let i = 0; i < 10; i++) {
    const sermon = server.create("sermon");
    const bulletin = server.create("bulletin", {
      group: englishService,
      serviceOrder: "- **Call to Worship**\n- **Praise & Worship**\n- **<a href='#announcements'>Announcements</a>**\n- **Offering**\n- <strong class='legacy-hack'>Sermon</strong>\n  Rev. Ryan Lee  \nJob 1\n- **Doxology**\n- **Benediction**",
      sermon
    });
    server.createList("announcement", 5, { bulletin });
  }

  server.createList("post", 40, { group: englishService });

  server.create("user", { email: "test@example.com", name: "Test User" });
}
