from pulp import *
import numpy as np
import pandas as pd


class LinearOptimizer:
	def __init__(self, z):
		self.z = z
	
	def getWarehouses(self):
		return np.arange(4)
	
	def getZones(self):
		return np.arange(4)
	
	def getDistances(self, W, B):
		return [[10.5]*len(B) for i in range(len(W))]
	
	def calculate_c(self):
		return 0.5
	
	def calculate_tau(self):
		return 0.5
	
	def constructProb(self, W, B, d, c, tau, z):
		x = [[LpVariable("x{}{}".format(i, j), 0, 1) for j in range(len(B))] for i in range(len(W))]
		prob = LpProblem("optimizer", LpMinimize)
		prob += lpSum([lpSum([x[i][j]*d[i][j] for j in range(len(B))]) for i in range(len(W))]) # objective function
		prob += lpSum([lpSum([x[i][j] for j in range(len(B))]) for i in range(len(W))]) <= z    # C1
		for j in range(len(B)):
			prob += lpSum([x[i][j] for i in range(len(W))]) >= c * tau * z                      # C2
		return [prob, x]
	
	def solve(self):
		W = self.getWarehouses()
		B = self.getZones()
		d = self.getDistances(W, B)
		c = self.calculate_c()
		tau = self.calculate_tau()
		prob, x = self.constructProb(W, B, d, c, tau, self.z)
		prob.solve()
		optimal_x = [[value(x[i][j]) for j in range(len(x[0]))] for i in range(len(x))]
		return optimal_x


if __name__ == '__main__':
	opt = LinearOptimizer(2)
	solution_matrix = opt.solve()
	print(solution_matrix)
