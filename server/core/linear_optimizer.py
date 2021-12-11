from pulp import *
import numpy as np
import pandas as pd


class LinearOptimizer:
	def __init__(self, z):
		self.z = z
	
	def getWarehouses(self):
		return pd.read_csv('../../datasets/data/warehouses.csv').values.tolist()
	
	def getZones(self):
		zones = pd.read_csv('../../datasets/data/zones.csv').values.tolist()
		self.zones = zones 
		return zones
	
	def getDistances(self):
		return pd.read_csv('../../datasets/data/distance_matrix.csv', header = None).values.tolist()
	
	def calculate_c(self):
		Sb = [b[4] - b[5] - b[6] - b[7] for b in self.zones]
		Vb = [b[8]/2 for b in self.zones]
		c = [(Sb[i] - Vb[i]) / sum(Sb) for i in range(len(Sb))]
		return c
	
	def calculate_tau(self):
		return 0.9
	
	def constructProb(self, W, B, d, c, tau, z):
		x = [[LpVariable("x{},{}".format(i, j), 0, 1) for j in range(len(B))] for i in range(len(W))]
		prob = LpProblem("optimizer", LpMinimize)
		prob += lpSum([lpSum([x[i][j]*d[i][j] for j in range(len(B))]) for i in range(len(W))]) # objective function
		prob += lpSum([lpSum([x[i][j] for j in range(len(B))]) for i in range(len(W))]) <= len(W)    # C1
		for j in range(len(B)):
			prob += lpSum([x[i][j] for i in range(len(W))]) >= c[j] * tau * z                  # C2
		return [prob, x]
	
	def solve(self):
		W = self.getWarehouses()
		B = self.getZones()
		d = self.getDistances()
		c = self.calculate_c()
		tau = self.calculate_tau()
		prob, x = self.constructProb(W, B, d, c, tau, self.z)
		prob.solve()
		optimal_x = [[value(x[i][j]) for j in range(len(x[0]))] for i in range(len(x))]
		return optimal_x


if __name__ == '__main__':
	opt = LinearOptimizer(500)
	solution_matrix = opt.solve()
	non_zero = 0
	for i in solution_matrix:
		for j in i:
			if(j != 0):
				non_zero += 1
	print(solution_matrix)
	print('Number of non zero element: ', non_zero)
	np.save('prediction_matrix.npy', solution_matrix)
