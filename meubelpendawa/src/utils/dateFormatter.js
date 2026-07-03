import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formatDateTime = (date) => {
    if (!date) return "-";

    return format(new Date(date), "dd MMM yyyy • HH:mm:ss", {
        locale: id,
    });
};

export const formatDate = (date) => {
    if (!date) return "-";

    return format(new Date(date), "dd MMM yyyy", {
        locale: id,
    });
};

export const formatTime = (date) => {
    if (!date) return "-";

    return format(new Date(date), "HH:mm:ss", {
        locale: id,
    });
};