import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import WorkingHoursForm from "./WorkingHoursForm";

interface Props {
  offerId: number;
  onClose: () => void;
}

const WorkingHoursModal: React.FC<Props> = ({ offerId, onClose }) => {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        График работы
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <WorkingHoursForm offerId={offerId} />
      </DialogContent>
    </Dialog>
  );
};

export default WorkingHoursModal;