process.env.NODE_ENV = "test";

const Tags = require("../models/tags");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

let tagHelper = null;

const agent = chai.request.agent(server);

describe("Tags", () => {
  before(async () => {
    await Tags.destroy({
      truncate: {
        cascade: true,
        restartIdentity: true,
      },
    });

    let user = {
      formFields: [
        { id: "email", value: "josephcartaphilus@notrealgmail.com" },
        { id: "password", value: "jcartaphilus12" },
      ],
    };

    await agent.post("/signin").send(user);
  });

  after(function () {
    agent.close();
  });

  describe("/POST create tag", () => {
    it("should POST correct tag body", (done) => {
      let body = {
        nama: "pengasuhan",
        deskripsi:
          "Pengasuhan mengacu pada interaksi antara orang tua dan anak",
        warna: "#f7a961",
      };
      agent
        .post("/tags")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Successfully creating tag!");
          res.body.should.have.property("data");
          tagHelper = res.body.data.id;
          done();
        });
    });

    it("should not POST when same tag name exists", (done) => {
      let body = {
        nama: "pengasuhan",
        deskripsi:
          "Pengasuhan mengacu pada interaksi antara orang tua dan anak",
        warna: "#f7a961",
      };
      agent
        .post("/tags")
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Same tag name is found!");
          done();
        });
    });
  });

  describe("/PUT update tag", () => {
    it("should PUT correct tag id with correct tag body", (done) => {
      let body = {
        nama: "parenting",
        deskripsi:
          "Pengasuhan mengacu pada interaksi antara parents to children",
        warna: "#f7a955",
      };
      agent
        .put(`/tags/${tagHelper}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Successfully updating tag!");
          agent.get(`/tags?id=${tagHelper}`).end((err, res) => {
            res.body.should.have
              .property("nama")
              .eql("parenting");
            done();
          });
        });
    });

    it("should not PUT when same tag name exists", (done) => {
      let body = {
        nama: "parenting",
        deskripsi:
          "Pengasuhan mengacu pada interaksi antara orang tua dan anak",
        warna: "#f7a961",
      };
      agent
        .put(`/tags/${tagHelper}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Same tag name is found!");
          done();
        });
    });
  });

  describe("/PUT follow tag", () => {
    it("should PUT to follow tag", (done) => {
      agent
        .put(`/tags/${tagHelper}/follow`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Successfully following tag!");
          done();
        });
    });

    it("should PUT to follow tag", (done) => {
      agent
        .put(`/tags/${tagHelper}/follow`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Successfully unfollowing tag!");
          done();
        });
    });
  });
});
