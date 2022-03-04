//
//  DrinkingEstablishmentsListViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/2/22.
//

import UIKit

class DrinkingEstablishmentsListViewController: UIViewController, UICollectionViewDelegate {
    
    private let manager = EstablishmentDataManager()
    
    var selectedEstablishment: EstablishmentItem?
    var selectedCity: LocationItem?
    var selectedTags: String?
    
    @IBOutlet var collectionView: UICollectionView!

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let identifier = segue.identifier {
            switch identifier {
            case Segue.showDetail.rawValue:
                showEstablishmentDetail(segue: segue)
            default:
                print("Segue not added.")
            }
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        createData()
        setupTitle()
    }
}

// MARK: Private Extension
private extension DrinkingEstablishmentsListViewController {
    func showEstablishmentDetail(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? EstablishmentDetailViewController,
           let indexPath = collectionView.indexPathsForSelectedItems?.first {
            selectedEstablishment = manager.establishmentItem(at: indexPath.row)
            viewController.selectedEstablishment = selectedEstablishment
        }
    }
    
    func createData() {
        guard let city = selectedCity?.city,
              let tag = selectedTags else {
                  return
              }
        manager.fetch(location: city, selectedEthanol: tag) {
            establishmentItems in
            if !establishmentItems.isEmpty {
                collectionView.backgroundView = nil
            } else {
                // NoDataView works
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Drinking Establishments", desc: "No establishments found.", accomm: "No accommodations found.", rating: "0.0", count: "0")
                collectionView.backgroundView = view
            }
            collectionView.reloadData()
        }
    }
    
    func setupTitle() {
        navigationController?.setNavigationBarHidden(false, animated: false)
        title = selectedCity?.cityAndState 
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}

// MARK:: UIColletionViewDataSource
extension DrinkingEstablishmentsListViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfEstablishmentItems()
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "establishmentCell", for: indexPath) as! DrinkingEstablishmentCell
        let establishmentItem = manager.establishmentItem(at: indexPath.row)
        cell.titleLabel.text = establishmentItem.name
        if let tag = establishmentItem.subtitle {
            cell.tagLabel.text = tag
        }
        
        if let accommodation = establishmentItem.accommodation_attributes {
            cell.accommodationsLabel.text = accommodation
        }
        cell.ratingLabel.text = establishmentItem.rating_value
        cell.countLabel.text = establishmentItem.rating_count
        return cell
    }
    
}


