const authorizeRole = require("../src/middlewares/authorizeRole");

describe("authorizeRole middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      auth: {
        realm_access: {
          roles: ["admin", "user"],
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("should call next() if user has the required role", () => {
    const middleware = authorizeRole("admin");
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("should return 403 if user does not have the required role", () => {
    const middleware = authorizeRole("manager"); // user doesn't have this
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied: insufficient role",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 if req.auth is missing", () => {
    const middleware = authorizeRole("admin");
    req = {}; // no auth

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied: insufficient role",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
