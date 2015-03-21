angular.module('mockedFeed', [])
  .value('defaultJSON', {
    query: {
      count: 2,
      created: '2013-05-16T15:01:31Z',
      lang: 'en-US',
      results: {
        entry: [
          {
            name: "John A. Doe",
            image: "image.jpg",
            email: "john@example.com"
          },
          {
            name: "Loop",
            image: "image2.png",
            email: "john2@example2.org"
          }
        ]
      }
    }
  });