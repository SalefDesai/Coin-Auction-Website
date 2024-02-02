import { toast } from "react-toastify"

export const showErrorToast = (data) => {
    toast.error(data,{
        position : "top-right",
        autoClose : 2000,
    })
}

export const showSuccessToast = (data) => {
    toast.success(data,{
        position: "top-center",
        autoClose: 2000,
    })
}