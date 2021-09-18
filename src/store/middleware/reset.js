import { resetAuth } from "../auth";
import { resetUser } from "../user";

const reset = ({ dispatch, getState }) => next => action => {
	if (action.type === "api/apiResetStore") {
		dispatch(resetAuth());
		dispatch(resetUser())
	}
	else next(action);
}

export default reset;