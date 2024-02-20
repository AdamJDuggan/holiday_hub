// var assert = require("assert");

// describe("Array", () => {
//   describe("#indexOf()", () => {
//     it("should return -1 when the value is not present", () => {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });

//During the test the env variable is set to test
process.env.NODE_ENV = "test";

// let Goal = require("../src/collections/goals/model");

//Require the dev-dependencies
let server = require("../index.ts");

let chai;
let chaiHttp;
let should;
//Our parent block
describe("Goals", () => {
  beforeAll(async () => {
    chai = await import("chai");
    chaiHttp = await import("chai-http");
    should = chai.should();
    chai.use(chaiHttp);
  });
  /*
   * Test the /GET route
   */
  describe("/GET book", () => {
    it("it should GET all the goals", (done) => {
      chai
        .request(server)
        .get("/api/goals")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
