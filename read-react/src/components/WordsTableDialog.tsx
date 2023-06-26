import * as React from "react";
import { IWord } from "../utils/api";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DenseTable from "./table";
import { Typography } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface IDialog {
  handleClose: () => void;
  handleDelete: (word: IWord) => void;
  handleEdit: (word: IWord) => void;
  words: IWord[];
}

export default function WordsTableDialog(props: IDialog) {
  const { handleClose, handleDelete, handleEdit, words } = props;

  return (
    <div>
      {words.length ? (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={true}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          ></BootstrapDialogTitle>
          <DenseTable
            words={words}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </BootstrapDialog>
      ) : (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={true}
        >
          <Typography>There are no words</Typography>
        </BootstrapDialog>
      )}
    </div>
  );
}
