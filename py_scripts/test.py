# Simple script creating 2 nodes and connecting them with a line in RFEM, in the current file already opened,
# using RFEM Python Client.

from RFEM.initModel import Model
from RFEM.BasicObjects.node import Node
from RFEM.BasicObjects.line import Line

# Initialize model - connects to the currently opened RFEM file
Model(True, "Demo")

# Begin modification
Model.clientModel.service.begin_modification()

# Create first node at coordinates (0, 0, 0)
Node(1, 0.0, 0.0, 0.0)

# Create second node at coordinates (5, 0, 0)
Node(2, 5.0, 0.0, 0.0)

# Create a line connecting node 1 and node 2
Line(1, '1 2')

# Finish modification
Model.clientModel.service.finish_modification()

print("Successfully created 2 nodes and 1 line connecting them.")
