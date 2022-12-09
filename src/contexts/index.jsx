import { createSuperContext } from "react-super-context";
import { useState } from "react";

const [UserContext, useUserContext] = createSuperContext(() => {
  const [user, setUser] = useState(null);
  return [user, setUser];
});

export { UserContext, useUserContext };
