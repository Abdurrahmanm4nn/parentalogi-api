process.env.NODE_ENV = "test";

const Users = require("../models/users");
const Comments = require("../models/comments");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

let commentHelper = { commentId: null, childCommentId: null };

let agent = chai.request.agent(server);

describe("Comments", () => {
  before(async () => {
    await Comments.destroy({
      truncate: {
        cascade: true,
        restartIdentity: true
      },
    });

    let user = {
      formFields: [
        { id: "email", value: "josephcartaphilus@notrealgmail.com" },
        { id: "password", value: "jcartaphilus12" },
      ],
    };

    await agent.post("/signin").send(user)
  });

  after(function () {
    agent.close();
  });

  describe("/POST create comment", () => {
    it("should POST correct comment body", (done) => {
      let body = {
        "id_post": 1,
        "orang_tua": 0,
        "isi_text": "Ini komentar saya"
      };
      agent
        .post("/comments")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully adding comment!");
          res.body.should.have.property("data");
          commentHelper.commentId = res.body.data.id;
          done();
        });
    });

    it("should POST correct comment body and corrent parent id", (done) => {
      let body = {
        "id_post": 1,
        "orang_tua": commentHelper.commentId,
        "isi_text": "Ini komentar balasan saya"
      };
      agent
        .post("/comments")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully adding comment!");
          res.body.should.have.property("data");
          commentHelper.childCommentId = res.body.data.id;
          agent
            .get(`/comments/${commentHelper.childCommentId}`)
            .end((err, res) => {
              res.body.should.have.property("orang_tua").eql(commentHelper.commentId);
              done();
            })
        });
    });

    it("should not POST when post doesn't exist", (done) => {
      let body = {
        "id_post": 8,
        "orang_tua": 0,
        "isi_text": "Ini komentar saya yang lain"
      };
      agent
        .post("/comments")
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Post is not found!");
          done();
        });
    });

    it("should not POST when parent comment doesn't exist", (done) => {
      let body = {
        "id_post": 1,
        "orang_tua": 9,
        "isi_text": "Ini komentar saya yang lain"
      };
      agent
        .post("/comments")
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Parent comment is not found!");
          done();
        });
    });

    it("should not POST when comment content is not provided", (done) => {
      let body = {
        "id_post": 1,
        "orang_tua": 0,
        "isi_text": ""
      };
      agent
        .post("/comments")
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Comment content must be supplied!");
          done();
        });
    });
  });

  describe("/PUT update comment", () => {
    it("should PUT correct comment body", (done) => {
      let body = {
        "isi_text": "Ini komentar saya yang diupdate"
      };
      agent
        .put(`/comments/${commentHelper.commentId}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully updating comment!");
          agent
            .get(`/comments/${commentHelper.commentId}`)
            .end((err, res) => {
            res.body.should.have.property("isi_text").eql("Ini komentar saya yang diupdate");
            done();
          })
        });
    });

    it("should not PUT on wrong comment id", (done) => {
      let body = {
        "isi_text": "Ini komentar saya terupdate"
      };
      agent
        .put(`/comments/${commentHelper.commentId-2}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Comment is not found!");
          done();
        });
    });

    it("should not PUT on empty comment content", (done) => {
      let body = {
        "isi_text": ""
      };
      agent
        .put(`/comments/${commentHelper.commentId}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Comment content must be supplied!");
          done();
        });
    });
  });

  describe("/PUT upvote comment", () => {
    it("should PUT upvote on correct comment id", (done) => {
      agent
        .put(`/comments/${commentHelper.commentId}/upvote`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully liking comment!");
          done();
        });
    });

    it("should PUT downvote on correct comment id", (done) => {
      agent
        .put(`/comments/${commentHelper.commentId}/upvote`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully disliking comment!");
          done();
        });
    });

    it("should not PUT upvote on wrong comment id", (done) => {
      agent
        .put(`/comments/${commentHelper.commentId-2}/upvote`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Comment is not found!");
          done();
        });
    });
  });

  describe("/DELETE comment", () => {
    it("should DELETE comment based on id", (done) => {
      agent
        .delete(`/comments/${commentHelper.commentId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Successfully deleting comment!");
          agent
            .get(`/comments/${commentHelper.commentId}`)
            .end((err, res) => {
              should.not.exist(res.body);
              agent
                .get(`/comments/${commentHelper.childCommentId}`)
                .end((err, res) => {
                  should.not.exist(res.body);
                  done();
                });
            });
        });
    });

    it("should not DELETE comment on wrong comment id", (done) => {
      agent
        .delete(`/comments/${commentHelper.commentId-2}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Comment is not found!");
          done();
        });
    });
  });
});