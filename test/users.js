process.env.NODE_ENV = "test";

const Users = require("../models/users");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

let agent = chai.request.agent(server);

describe("Users", () => {
  before(async () => {
    await Users.destroy({
      truncate: { cascade: true },
    });
  });

  after(function () {
    agent.close();
  });

  describe("/POST sign up", () => {
    it("it should POST simple sign up request", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "cartaphilus" },
          { id: "nama", value: "Joseph Cartaphilus" },
          { id: "email", value: "josephcartaphilus@notrealgmail.com" },
          { id: "password", value: "jcartaphilus12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("OK");
          res.body.user.should.have.property("email");
          res.body.user.should.have.property("id");
          res.body.user.should.have.property("timeJoined");
          done();
        });
    });

    it("it should not POST when there's a same email present", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "chisehatori" },
          { id: "nama", value: "Chise Hatori" },
          { id: "email", value: "josephcartaphilus@notrealgmail.com" },
          { id: "password", value: "chisehatori1212" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("This email already exists. Please sign in instead.");
          done();
        });
    });

    it("it should not POST when nama_pengguna is not provided", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "eliasthemagus12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have
            .property("id")
            .eql("nama_pengguna");
          done();
        });
    });

    it("it should not POST when nama is not provided", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "sherieshatterie" },
          { id: "nama", value: "" },
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "eliasthemagus12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have.property("id").eql("nama");
          done();
        });
    });

    it("it should not POST when email is not provided", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "sherieshatterie" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "" },
          { id: "password", value: "eliasthemagus12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have.property("id").eql("email");
          done();
        });
    });

    it("it should not POST when password is not provided", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "sherieshatterie" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have.property("id").eql("password");
          done();
        });
    });

    it("it should not POST when email is not valid", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "eliasainsworth" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "eliasgmailcom" },
          { id: "password", value: "eliasthemagus12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Email is invalid");
          res.body.formFields[0].should.have.property("id").eql("email");
          done();
        });
    });

    it("it should not POST when password is less than 8 chars", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "eliasainsworth" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "sher12" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql(
              "Password must contain at least 8 characters, including a number"
            );
          res.body.formFields[0].should.have.property("id").eql("password");
          done();
        });
    });

    it("it should not POST when password is not providing any number", (done) => {
      let body = {
        formFields: [
          { id: "nama_pengguna", value: "eliasainsworth" },
          { id: "nama", value: "Elias Ainsworth" },
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "eliasthemagus" },
        ],
      };
      chai
        .request(server)
        .post("/signup")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Password must contain at least one number");
          res.body.formFields[0].should.have.property("id").eql("password");
          done();
        });
    });
  });

  describe("/POST sign in", () => {
    it("it should not POST wrong credentials", (done) => {
      let body = {
        formFields: [
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "eliasainsworth12" },
        ],
      };
      chai
        .request(server)
        .post("/signin")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eql("WRONG_CREDENTIALS_ERROR");
          res.should.not.have.cookie("sAccessToken");
          res.should.not.have.cookie("sIdRefreshToken");
          done();
        });
    });

    it("it should not POST when email is not provided", (done) => {
      let body = {
        formFields: [
          { id: "email", value: "" },
          { id: "password", value: "eliasthemagus12" },
        ],
      };
      chai
        .request(server)
        .post("/signin")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have.property("id").eql("email");
          done();
        });
    });

    it("it should not POST when password is not provided", (done) => {
      let body = {
        formFields: [
          { id: "email", value: "eliasainsworth@notrealgmail.com" },
          { id: "password", value: "" },
        ],
      };
      chai
        .request(server)
        .post("/signin")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("FIELD_ERROR");
          res.body.formFields[0].should.have
            .property("error")
            .eql("Field is not optional");
          res.body.formFields[0].should.have.property("id").eql("password");
          done();
        });
    });

    it("it should POST simple sign in request", (done) => {
      let body = {
        formFields: [
          { id: "email", value: "josephcartaphilus@notrealgmail.com" },
          { id: "password", value: "jcartaphilus12" },
        ],
      };
      agent
        .post("/signin")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("OK");
          res.body.user.should.have
            .property("email")
            .eql("josephcartaphilus@notrealgmail.com");
          res.body.user.should.have.property("id");
          res.body.user.should.have.property("timeJoined");
          agent.should.have.cookie("sAccessToken");
          agent.should.have.cookie("sIdRefreshToken");
          done();
        });
    });
  });

  describe("/POST forget password request", () => {
    it("it should POST when valid and existing email provided", (done) => {
      let body = {
        formFields: [
          { id: "email", value: "josephcartaphilus@notrealgmail.com" },
        ],
      };
      agent
        .post("/user/password/reset/token")
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("OK");
          done();
        });
    });

    // it("it should not POST when non valid nor existing email provided", (done) => {
    //   let body = {
    //     formFields: [{ id: "email", value: "chisehatori@notrealgmail.com" }],
    //   };
    //   chai
    //     .request(server)
    //     .post("/user/password/reset/token")
    //     .send(body)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("object");
    //       res.body.should.not.have.property("status").eql("OK");
    //       done();
    //     });
    // });
  });

  describe("/GET my profile", () => {
    it("it should not GET when there is non valid cookie", (done) => {
      chai
        .request(server)
        .get("/users/profile")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("unauthorised");
          done();
        });
    });

    it("it should GET when there is a valid cookie credentials", (done) => {
      agent.get("/users/profile").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have
          .property("email")
          .eql("josephcartaphilus@notrealgmail.com");
        res.body.should.have.property("nama_pengguna").eql("cartaphilus");
        res.body.should.have.property("nama").eql("Joseph Cartaphilus");
        res.body.should.have.property("bio").eql(null);
        done();
      });
    });
  });

  // describe("/PUT edit profile", () => {
  //   it("it should PUT when there is a valid cookie", (done) => {
  //     chai
  //       .request(server)
  //       .put("/users/edit-profile")
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         res.body.should.have
  //           .property("message")
  //           .eql("Successfully Updating Profile!");
  //         done();
  //       });
  //   });
  // });

  describe("/POST sign out", () => {
    it("it should POST when there is a valid cookie credentials", (done) => {
      agent.post("/signout").end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("status").eql("OK");
        agent.should.not.have.cookie("sAccessToken");
        agent.should.not.have.cookie("sIdRefreshToken");
        done();
      });
    });
  });
});
