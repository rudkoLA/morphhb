import * as React from "react";
import { IWord } from "../utils/api";
import { fetchWord } from "../utils/api";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

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
  handleSubmit: (word: IWord) => void;
  word: IWord;
}

export default function DictionaryDialog({
  handleClose,
  handleSubmit,
  word,
}: IDialog) {
  const [term, setTerm] = React.useState(word.id);
  const [definition, setDefinition] = React.useState(word.definition);

  React.useEffect(() => {
    fetchWord(word.id).then((data) => {
      setDefinition(data.definition);
    });
  }, [word.id]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={true}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Save word
        </BootstrapDialogTitle>
        <DialogContent dividers className="dialogContent">
          <Typography gutterBottom>Add a definition for the word</Typography>
          <TextField
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
            className="dialogField"
            label="Term"
            variant="outlined"
            defaultValue={word.id}
          />

          <TextField
            onChange={(e) => {
              setDefinition(e.target.value);
            }}
            className="dialogField"
            label="Definition"
            variant="outlined"
            value={definition}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              handleSubmit({ ...word, id: term, definition } as IWord)
            }
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
