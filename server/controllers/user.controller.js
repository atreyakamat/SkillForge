export async function me(req, res) {
  res.json({ id: req.user.id, email: req.user.email, roles: req.user.roles })
}

