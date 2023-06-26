import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IWord } from "../utils/api";

interface ITable {
  handleEdit: (word: IWord) => void;
  handleDelete: (word: IWord) => void;
  words: IWord[];
}

export default function DenseTable(props: ITable) {
  const { words, handleEdit, handleDelete } = props;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Terms</TableCell>
            <TableCell align="right">Definition</TableCell>
            <TableCell align="right">Verse</TableCell>
            <TableCell align="right">Edit</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {words.map((word) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{word.id}</TableCell>
              <TableCell align="right">{word.definition}</TableCell>
              <TableCell align="right">{word.verse}</TableCell>
              <TableCell align="right">
                <EditIcon
                  sx={{ ":hover": { cursor: "pointer" } }}
                  onClick={() => handleEdit(word)}
                />
              </TableCell>
              <TableCell align="right">
                <DeleteIcon
                  sx={{ ":hover": { cursor: "pointer" } }}
                  onClick={() => handleDelete(word)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
