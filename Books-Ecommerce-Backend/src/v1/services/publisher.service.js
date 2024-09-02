class PublisherService {
  // Info for : Profile info page
  static getAllPublisher = async () => {
    const publisher = await db.publisher.findAll({
      attributes: [
        ["pub_id", "id"],
        ["pub_slug", "slug"],
        ["pub_name", "name"],
      ],
    });

    return {
      publisherData: publisher,
    };
  };
}

module.exports = PublisherService;
