var normal = "color",
    library = {
        "my": {
            "color": {
                "eye": "blue-green",
                "hair": "dirty blonde"
            },
            "major": "Computer Science"
        },
        "Mariah's": {
            "color": {
                "eye": "brown",
                "hair": "blonde"
            },
            "major": "Biomedical Engineering"
        },
        "Brandon's": {
            "color": {
                "eye": "black",
                "hair": "black"
            },
            "major": "Computer Science"
        }
    },
    StringFiler;

describe("constructor", function () {
    it("throws an error if not given settings", function () {
        chai.expect(function () {
            new StringFilr();
        }).to.throw("No settings given to StringFilr.");
    });

    it("throws an error if not given library", function () {
        chai.expect(function () {
            new StringFilr({});
        }).to.throw("No library given to StringFilr.");
    });

    it("runs", function () {
        StringFiler = new StringFilr({
            "normal": normal,
            "library": library
        });
    });

    it("stores normal", function () {
        chai.expect(StringFiler.getNormal()).to.be.equal(normal);
    });

    it("stores library", function () {
        chai.expect(StringFiler.getLibrary()).to.be.equal(library);
    });

    it("initializes a blank cache", function () {
        chai.expect(StringFiler.getCache()).to.be.deep.equal({});
    });
});